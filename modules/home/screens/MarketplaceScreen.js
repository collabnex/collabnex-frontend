import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  useWindowDimensions,
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../../global/services/env";
import { Colors } from "../../global/theme/colors";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

const TABS = {
  PRODUCTS: "PRODUCTS",
  SERVICES: "SERVICES",
};


export default function Marketplace({ navigation }) {
  const [activeTab, setActiveTab] = useState(TABS.PRODUCTS);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);

  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true); // price sort

  const { width } = useWindowDimensions();
  const numColumns = width >= 768 ? 3 : 2;
  const GAP = 12;
  const CARD_WIDTH = (width - GAP * (numColumns + 1)) / numColumns;

  useFocusEffect(
    useCallback(() => {
      loadData(); // or loadProducts()
    }, [])
  );

  const loadData = async () => {
    const token = await AsyncStorage.getItem("token");

    const [p, s] = await Promise.all([
      axios.get(`${API_BASE_URL}/physical-products`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${API_BASE_URL}/service-products`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    setProducts(p.data);
    setServices(s.data);
  };

  const baseData = activeTab === TABS.PRODUCTS ? products : services;

  // 🔍 SEARCH + ↕ SORT
  const data = useMemo(() => {
    let list = [...baseData];

    if (search.trim()) {
      list = list.filter((i) =>
        i.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    list.sort((a, b) =>
      sortAsc ? a.price - b.price : b.price - a.price
    );

    return list;
  }, [baseData, search, sortAsc]);

  const getImage = (path) =>
    path ? `${API_BASE_URL}/${path}` : "https://via.placeholder.com/300";

  const handleBuyNow = (item) => {
    if (activeTab === TABS.PRODUCTS) {
      navigation.navigate("BuyNow", { product: item });
    } else {
      navigation.navigate("BuyNowScreen", {
        serviceProductId: item.id,
        title: item.title,
      });
    }
  };

  const renderCard = ({ item }) => (
    <View style={[styles.card, { width: CARD_WIDTH }]}>
      <Image source={{ uri: getImage(item.imagePath) }} style={styles.image} />

      <Text numberOfLines={1} style={styles.title}>
        {item.title}
      </Text>

      <Text numberOfLines={2} style={styles.desc}>
        {item.description}
      </Text>

      <View style={styles.row}>
        <Text style={styles.price}>₹ {item.price}</Text>
        {item.deliveryTimeDays && (
          <Text style={styles.delivery}>
            {item.deliveryTimeDays}d
          </Text>
        )}
      </View>

      <TouchableOpacity style={styles.buyBtn} onPress={() => handleBuyNow(item)}>
        <Text style={styles.buyText}>Buy Now</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* TOP ACTIONS */}
      <View style={styles.topActions}>
        <TopBtn
          title="Sell Product"
          onPress={() => navigation.navigate("SellProduct")}
        />
        <TopBtn
          title="Sell Service"
          onPress={() => navigation.navigate("SellServices")}
        />
        <TopBtn
          title="My Orders"
          onPress={() => navigation.navigate("MyOrders")}
        />
      </View>

      {/* TABS */}
      <View style={styles.tabs}>
        <Tab
          title="Products"
          active={activeTab === TABS.PRODUCTS}
          onPress={() => setActiveTab(TABS.PRODUCTS)}
        />
        <Tab
          title="Services"
          active={activeTab === TABS.SERVICES}
          onPress={() => setActiveTab(TABS.SERVICES)}
        />
      </View>

      {/* GRID */}
      <FlatList
        data={data}
        keyExtractor={(i) => i.id.toString()}
        renderItem={renderCard}
        numColumns={numColumns}
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={{ padding: GAP, paddingBottom: 110 }}
        showsVerticalScrollIndicator={false}
      />

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <TextInput
          placeholder="Search By Name"
          value={search}
          onChangeText={setSearch}
          style={styles.search}
          placeholderTextColor={Colors.textSecondary}
        />

        <IconBtn
          label={sortAsc ? "₹ ↑" : "₹ ↓"}
          onPress={() => setSortAsc(!sortAsc)}
        />

        <IconBtn label="Filter" onPress={() => { }} />
      </View>
    </View>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

const Tab = ({ title, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.tab, active && styles.tabActive]}
  >
    <Text style={[styles.tabText, active && styles.tabTextActive]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const TopBtn = ({ title, onPress }) => (
  <TouchableOpacity style={styles.topBtn} onPress={onPress}>
    <Text style={styles.topBtnText}>{title}</Text>
  </TouchableOpacity>
);

const IconBtn = ({ label, onPress }) => (
  <TouchableOpacity style={styles.iconBtn} onPress={onPress}>
    <Text style={styles.iconText}>{label}</Text>
  </TouchableOpacity>
);

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  topActions: {
    flexDirection: "row",
    padding: 10,
    gap: 8,
  },

  topBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
  },

  topBtnText: {
    color: Colors.white,
    fontWeight: "700",
    fontSize: 13,
  },

  tabs: {
    flexDirection: "row",
    margin: 10,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 4,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },

  tabActive: {
    backgroundColor: Colors.primary,
  },

  tabText: {
    color: Colors.textSecondary,
    fontWeight: "600",
  },

  tabTextActive: {
    color: Colors.white,
  },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    elevation: 2,
  },

  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: Colors.border,
  },

  title: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginTop: 8,
  },

  desc: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
  },

  delivery: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  buyBtn: {
    backgroundColor: Colors.secondary,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },

  buyText: {
    color: Colors.white,
    fontWeight: "700",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 10,
    borderTopWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },

  search: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: Colors.textPrimary,
  },

  iconBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.primary,
  },

  iconText: {
    color: Colors.white,
    fontWeight: "600",
  },
});
