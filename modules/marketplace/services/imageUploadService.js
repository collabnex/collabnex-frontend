import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://localhost:8080/api";

/**
 * Get presigned URL from backend (JWT protected)
 */
export const getPresignedUrl = async (contentType) => {
  const token = await AsyncStorage.getItem("token");

  const response = await axios.get(
    `${BASE_URL}/files/presigned-url`,
    {
      params: { contentType },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;  // { uploadUrl, fileUrl }
};

/**
 * Upload image to AWS S3 using presigned URL
 * ✅ RETURNS RELATIVE PATH (images/uuid.jpg)
 */
export const uploadImageToS3 = async (imageUri) => {
  // 1️⃣ Get presigned URL + imagePath
  const { uploadUrl, fileUrl } = await getPresignedUrl("image/jpeg");

  // 2️⃣ Convert image URI → Blob
  const imageResponse = await fetch(imageUri);
  const imageBlob = await imageResponse.blob();


  // 3️⃣ Upload to S3 (NO TOKEN)
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "image/jpeg",
    },
    body: imageBlob,
  });

  if (!uploadResponse.ok) {
    throw new Error("S3 upload failed");
  }

  // 4️⃣ RETURN RELATIVE PATH ONLY
  return fileUrl; // images/uuid.jpg
};
