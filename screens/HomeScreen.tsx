import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList } from "../App";
import { InspectionFormModal } from "../components/InspectionFormModal";
import { useAuth } from "../context/auth";
import { deleteInspection, findAllInspections } from "../repositories/inspectionRepository";
import { Inspection } from "../types/inspection";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingInspection, setEditingInspection] = useState<Inspection | null>(null);

  const { logout } = useAuth();
  const insets = useSafeAreaInsets();
  const db = useSQLiteContext();

  async function fetchInspections() {
    const data = await findAllInspections(db);
    setInspections(data);
  }

  useEffect(() => {
    fetchInspections();
  }, []);

  async function handleDelete(id: number) {
    Alert.alert("Confirmar", "Excluir inspeção?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await deleteInspection(db, id);
          fetchInspections();
        },
      },
    ]);
  }

  const renderItem = ({ item }: { item: Inspection }) => (
    <View style={styles.item}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Inspection", { inspectionId: String(item.id) })}
        style={styles.itemTouch}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.address}</Text>
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => {
            setEditingInspection(item);
            setIsModalVisible(true);
          }}
          style={styles.editBtn}
        >
          <Text style={styles.editBtnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
          <Text style={styles.deleteBtnText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={inspections}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma inspeção encontrada</Text>}
      />
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            setEditingInspection(null);
            setIsModalVisible(true);
          }}
        >
          <Text style={styles.addBtnText}>+ Nova Inspeção</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
      <InspectionFormModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          setEditingInspection(null);
        }}
        onInspectionCreated={fetchInspections}
        inspection={editingInspection}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f9f9f9" },
  listContent: { paddingBottom: 100 },
  item: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
  },
  itemTouch: { flex: 1, marginRight: 8 },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
  subtitle: { fontSize: 13, color: "#666" },
  actions: { flexDirection: "row", gap: 6 },
  editBtn: {
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editBtnText: { color: "#1976d2", fontWeight: "600", fontSize: 13 },
  deleteBtn: {
    backgroundColor: "#fce4ec",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteBtnText: { color: "#d32f2f", fontWeight: "600", fontSize: 13 },
  footer: { marginTop: "auto" },
  addBtn: {
    backgroundColor: "#28a745",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  logoutBtn: { marginTop: 10, alignItems: "center" },
  logoutText: { color: "#dc3545", fontWeight: "600" },
  emptyText: { textAlign: "center", marginTop: 20, color: "#666" },
});
