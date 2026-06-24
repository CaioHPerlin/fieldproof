import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../App";
import { AttachmentFormModal } from "../components/AttachmentFormModal";
import { AttachmentPreviewModal } from "../components/AttachmentPreviewModal";
import { Footer, footerStyles } from "../components/Footer";
import {
  deleteAttachment,
  findAttachmentsByInspectionId,
} from "../repositories/attachmentRepository";
import { findInspectionById } from "../repositories/inspectionRepository";
import { colors, radius, spacing } from "../theme";
import { Attachment } from "../types/attachment";
import { Inspection } from "../types/inspection";
import { formatDate } from "../utils/formatter";
import { base64ToImageUri } from "../utils/image";
import { openMaps } from "../utils/maps";

type Props = NativeStackScreenProps<RootStackParamList, "Inspection">;

export function InspectionScreen({ navigation, route }: Props) {
  const { inspectionId } = route.params;
  const db = useSQLiteContext();

  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [attachmentFormVisible, setAttachmentFormVisible] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);

  const fetchData = async () => {
    const [insp, atts] = await Promise.all([
      findInspectionById(db, inspectionId),
      findAttachmentsByInspectionId(db, inspectionId),
    ]);

    setInspection(insp);
    setAttachments(atts);

    if (insp) navigation.setOptions({ title: insp.title });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteAttachment = (attachmentId: number) => {
    Alert.alert("Excluir anexo", "Tem certeza que deseja excluir este anexo?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          await deleteAttachment(db, attachmentId);
          fetchData();
        },
      },
    ]);
  };

  const renderAttachment = ({ item }: { item: Attachment }) => (
    <View style={styles.attItem}>
      <TouchableOpacity onPress={() => setPreviewAttachment(item)}>
        <Image
          source={{ uri: base64ToImageUri(item.imageBase64) }}
          style={styles.attImage}
          resizeMode="contain"
        />
        <Text style={styles.attAnnotation}>{item.annotation}</Text>
        <Text style={styles.attDate}>{formatDate(item.timestamp)}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteAttachment(item.id)} style={styles.deleteBtn}>
        <Text style={styles.deleteBtnText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {inspection && (
        <View style={styles.info}>
          <Text style={styles.infoText}>{inspection.address}</Text>
          <Text style={styles.infoDate}>📅 {formatDate(inspection.date)}</Text>
        </View>
      )}

      <FlatList
        data={attachments}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderAttachment}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma evidência registrada</Text>}
        contentContainerStyle={styles.listContent}
      />

      <Footer>
        <TouchableOpacity
          style={footerStyles.primary}
          onPress={() => setAttachmentFormVisible(true)}
        >
          <Text style={footerStyles.primaryText}>+ Adicionar Evidência</Text>
        </TouchableOpacity>

        {inspection?.latitude != null && inspection?.longitude != null && (
          <TouchableOpacity
            onPress={() => openMaps(inspection.latitude!, inspection.longitude!)}
            style={footerStyles.link}
          >
            <Text style={footerStyles.linkText}>Localizar no Google Maps</Text>
          </TouchableOpacity>
        )}
      </Footer>

      <AttachmentFormModal
        visible={attachmentFormVisible}
        inspectionId={inspectionId}
        onClose={() => setAttachmentFormVisible(false)}
        onAttachmentCreated={fetchData}
      />

      <AttachmentPreviewModal
        visible={!!previewAttachment}
        attachment={previewAttachment}
        onClose={() => setPreviewAttachment(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.sm, backgroundColor: colors.background },
  info: { backgroundColor: colors.surface, padding: spacing.md, marginBottom: spacing.sm },
  infoText: { fontSize: 14, color: colors.text.secondary, marginTop: spacing.xs },
  infoDate: { textAlign: "right", fontSize: 12, color: colors.text.muted, marginTop: spacing.xs },
  listContent: { paddingHorizontal: spacing.sm, paddingBottom: spacing.lg },
  attItem: {
    backgroundColor: colors.surface,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderRadius: radius.sm,
    gap: spacing.xs,
  },
  attImage: { width: "100%", height: 160, borderRadius: radius.sm, marginBottom: spacing.xs },
  attAnnotation: { fontSize: 14, fontWeight: "500" },
  attDate: { fontSize: 12, color: colors.text.muted, marginTop: spacing.xs },
  deleteBtn: {
    backgroundColor: colors.danger,
    padding: spacing.xs,
    borderRadius: radius.sm,
    alignItems: "center",
  },
  deleteBtnText: { color: colors.text.white, fontSize: 13, fontWeight: "bold" },
  empty: { textAlign: "center", marginTop: spacing.lg, color: colors.text.muted },
});
