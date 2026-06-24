import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../App";
import { Footer, footerStyles } from "../components/Footer";
import { InspectionFormModal } from "../components/InspectionFormModal";
import { useAuth } from "../context/auth";
import { deleteInspection, findAllInspections } from "../repositories/inspectionRepository";
import { colors, radius, spacing } from "../theme";
import { Inspection } from "../types/inspection";
import { formatDate } from "../utils/formatter";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingInspection, setEditingInspection] = useState<Inspection | null>(null);

  const { logout } = useAuth();
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
        onPress={() => navigation.navigate("Inspection", { inspectionId: item.id })}
        style={styles.itemTouch}
      >
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{formatDate(item.date)}</Text>
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
      <Footer>
        <TouchableOpacity
          style={footerStyles.primary}
          onPress={() => {
            setEditingInspection(null);
            setIsModalVisible(true);
          }}
        >
          <Text style={footerStyles.primaryText}>+ Nova Inspeção</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout} style={footerStyles.link}>
          <Text style={[footerStyles.linkText, { color: colors.danger }]}>Sair</Text>
        </TouchableOpacity>
      </Footer>
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
  container: { flex: 1, padding: spacing.md, backgroundColor: colors.background },
  listContent: { paddingBottom: 100 },
  item: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: radius.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 1,
  },
  itemTouch: { flex: 1, marginRight: spacing.sm },
  title: { fontSize: 16, fontWeight: "600", marginBottom: spacing.xs },
  subtitle: { fontSize: 13, color: colors.text.secondary },
  actions: { flexDirection: "row", gap: spacing.xs },
  editBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  editBtnText: { color: colors.text.white, fontWeight: "600", fontSize: 13 },
  deleteBtn: {
    backgroundColor: colors.danger,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  deleteBtnText: { color: colors.text.white, fontWeight: "600", fontSize: 13 },
  emptyText: { textAlign: "center", marginTop: spacing.lg, color: colors.text.secondary },
});
