import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { colors, radius, spacing } from "../theme";
import { Attachment } from "../types/attachment";
import { formatCoordinate, formatDate } from "../utils/formatter";
import { base64ToImageUri } from "../utils/image";
import { openMaps } from "../utils/maps";
import { Modal } from "./Modal";

type Props = {
  visible: boolean;
  attachment: Attachment | null;
  onClose: () => void;
};

export function AttachmentPreviewModal({ visible, attachment, onClose }: Props) {
  const { height: screenHeight } = useWindowDimensions();

  if (!attachment) return null;

  const hasLocation = attachment.latitude != null && attachment.longitude != null;

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      overlayDark
      containerStyle={{ width: "95%", maxHeight: "90%", padding: spacing.lg }}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image
          source={{ uri: base64ToImageUri(attachment.imageBase64) }}
          style={[styles.image, { height: screenHeight * 0.5 }]}
          resizeMode="contain"
        />
        <Text style={styles.annotation}>{attachment.annotation}</Text>
        <Text style={styles.timestamp}>📅 {formatDate(attachment.timestamp)}</Text>
        {hasLocation && (
          <Text style={styles.coords}>
            📍 {formatCoordinate(attachment.latitude!)}, {formatCoordinate(attachment.longitude!)}
          </Text>
        )}
      </ScrollView>

      <View style={styles.actions}>
        {hasLocation && (
          <TouchableOpacity
            onPress={() => openMaps(attachment.latitude!, attachment.longitude!)}
            style={styles.mapsBtn}
          >
            <Text style={styles.mapsBtnText}>Ver posição no Google Maps</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeBtnText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scroll: { alignItems: "center" },
  image: { width: "100%", borderRadius: radius.sm, marginBottom: spacing.md },
  annotation: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: spacing.sm,
    alignSelf: "flex-start",
  },
  timestamp: {
    fontSize: 13,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    alignSelf: "flex-start",
  },
  coords: {
    fontSize: 13,
    color: colors.text.muted,
    marginBottom: spacing.sm,
    alignSelf: "flex-start",
  },
  actions: { gap: spacing.sm, marginTop: spacing.sm },
  mapsBtn: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.sm,
    alignItems: "center",
  },
  mapsBtnText: { color: colors.text.white, fontWeight: "bold" },
  closeBtn: {
    backgroundColor: colors.danger,
    padding: spacing.md,
    borderRadius: radius.sm,
    alignItems: "center",
  },
  closeBtnText: { color: colors.text.white, fontWeight: "bold" },
});
