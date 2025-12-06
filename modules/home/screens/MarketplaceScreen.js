import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

function ShowcaseScreen({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      
      {/* Top Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>

        {/* Sell Product */}
        <TouchableOpacity
          onPress={() => navigation.navigate("SellProduct")}

          style={{
            flex: 1,
            backgroundColor: "#8000FF",
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: "center",
            marginRight: 10,
            elevation: 4,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Sell Product
          </Text>
        </TouchableOpacity>

        {/* Sell Services */}
        <TouchableOpacity
          onPress={() => navigation.navigate("SellServices")}
          style={{
            flex: 1,
            backgroundColor: "#FF6B00",
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: "center",
            marginLeft: 10,
            elevation: 4,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            Sell Services
          </Text>
        </TouchableOpacity>

        {/* My Orders */}
        <TouchableOpacity
          onPress={() => navigation.navigate("MyOrders")}
          style={{
            flex: 1,
            backgroundColor: "rgba(69, 187, 30, 1)",
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: "center",
            marginLeft: 20,
            elevation: 4,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
            My Orders
          </Text>
        </TouchableOpacity>

      </View>

      {/* Below content */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Marketplace</Text>
      </View>
    </View>
  );
}

export default ShowcaseScreen;

//----------------------------------------------------------

// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// // const ShowcaseScreen = () => (
// //     <View style={styles.container}>
// //         <Text style={styles.title}>Marketplace</Text>
// //     </View>
// // );

// function ShowcaseScreen() {
//   return (
//     <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      
//       {/* Top Buttons */}
//       <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
        
//         {/* Sell Product */}
//         <TouchableOpacity
//           style={{
//             flex: 1,
//             backgroundColor: "#8000FF",
//             paddingVertical: 14,
//             borderRadius: 12,
//             alignItems: "center",
//             marginRight: 10,
//             elevation: 4, // shadow for Android
//             shadowColor: "#000", // iOS shadow
//             shadowOpacity: 0.2,
//             shadowRadius: 4,
//             shadowOffset: { width: 0, height: 2 },
//           }}
//         >
//           <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
//             Sell Product
//           </Text>
//         </TouchableOpacity>

//         {/* Sell Services */}
//         <TouchableOpacity
//           style={{
//             flex: 1,
//             backgroundColor: "#FF6B00",
//             paddingVertical: 14,
//             borderRadius: 12,
//             alignItems: "center",
//             marginLeft: 10,
//             elevation: 4,
//             shadowColor: "#000",
//             shadowOpacity: 0.2,
//             shadowRadius: 4,
//             shadowOffset: { width: 0, height: 2 },
//           }}
//         >
//           <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
//             Sell Services
//           </Text>
//         </TouchableOpacity>

//         {/* Sell Product */}
//         <TouchableOpacity
//           style={{
//             flex: 1,
//             backgroundColor: "rgba(69, 187, 30, 1)",
//             paddingVertical: 14,
//             borderRadius: 12,
//             alignItems: "center",
//             marginLeft: 20,
//             elevation: 4, // shadow for Android
//             shadowColor: "#000", // iOS shadow
//             shadowOpacity: 0.2,
//             shadowRadius: 4,
//             shadowOffset: { width: 0, height: 2 },
//           }}
//         >
//           <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
//             My Orders
//           </Text>
//         </TouchableOpacity>

//       </View>

//       {/* Below content */}
//       <View
//         style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//         }}
//       >
//         <Text style={{ fontSize: 24, fontWeight: "bold" }}>Marketplace</Text>
//       </View>
//     </View>
//   );
// }


// const styles = StyleSheet.create({
//     container: { flex: 1, justifyContent: "center", alignItems: "center" },
//     title: { fontSize: 22, fontWeight: "600" }
// });

// export default ShowcaseScreen;
