import { useNavigation } from "@react-navigation/native";

const navigation = useNavigation();



<TouchableOpacity
  onPress={() => navigation.navigate("Settings")}
>
  <Text>⚙️ Settings</Text>
</TouchableOpacity>
