import * as ImagePicker from "expo-image-picker";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  countAttachmentsByInspectionId,
  insertAttachment,
} from "../repositories/attachmentRepository";
import { colors, radius, spacing } from "../theme";
import { suggestCurrentAddress } from "../utils/geocoding";
import { FormField } from "./FormField";
import { Modal } from "./Modal";

type Props = {
  visible: boolean;
  inspectionId: number;
  onClose: () => void;
  onAttachmentCreated: () => void;
};

export function AttachmentFormModal({
  visible,
  inspectionId,
  onClose,
  onAttachmentCreated,
}: Props) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [annotation, setAnnotation] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [nextNumber, setNextNumber] = useState(0);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const db = useSQLiteContext();

  useEffect(() => {
    if (!visible) return;

    setImageUri(null);
    setImageBase64(null);
    setAnnotation("");
    setLatitude(null);
    setLongitude(null);
    resolveLocation();
  }, [visible]);

  const resolveLocation = async () => {
    setLoadingLocation(true);
    try {
      const count = await countAttachmentsByInspectionId(db, inspectionId);
      setNextNumber(count + 1);

      const resolved = await suggestCurrentAddress();
      if (resolved) {
        setLatitude(resolved.latitude);
        setLongitude(resolved.longitude);
      }
    } finally {
      setLoadingLocation(false);
    }
  };

  const takePicture = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert("Permissão negada", "É necessário permitir o acesso à câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      base64: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      setImageBase64(asset.base64 ?? null);
    }
  };

  const handleSave = async () => {
    if (!imageBase64) {
      Alert.alert("Nenhuma foto", "Capture uma foto antes de salvar.");
      return;
    }

    try {
      await insertAttachment(db, {
        inspectionId,
        imageBase64,
        annotation: annotation.trim() || `Anexo #${nextNumber}`,
        latitude,
        longitude,
        timestamp: new Date().toISOString(),
      });
      onAttachmentCreated();
      onClose();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar o anexo.");
    }
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} containerStyle={{ width: "92%" }}>
      <Text style={styles.header}>Nova Evidência</Text>

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
      ) : (
        <TouchableOpacity onPress={takePicture} style={styles.cameraPlaceholder}>
          <Text style={styles.cameraIcon}>📷</Text>
          <Text style={styles.cameraLabel}>Toque para fotografar</Text>
        </TouchableOpacity>
      )}

      <FormField
        label="Anotação"
        placeholder={`Anexo #${nextNumber}`}
        value={annotation}
        onChangeText={setAnnotation}
        editable={!loadingLocation}
      />

      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveBtn, (!imageUri || loadingLocation) && styles.btnDisabled]}
          disabled={!imageUri || loadingLocation}
        >
          <Text style={styles.btnText}>Salvar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
          <Text style={styles.btnText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  preview: {
    width: "100%",
    height: 220,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  cameraPlaceholder: {
    width: "100%",
    height: 220,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  cameraIcon: { fontSize: 36, marginBottom: spacing.sm },
  cameraLabel: { fontSize: 14, color: colors.text.muted },
  buttons: { flexDirection: "row", justifyContent: "space-between", marginTop: spacing.xs },
  saveBtn: {
    backgroundColor: colors.success,
    padding: spacing.sm,
    borderRadius: radius.sm,
    flex: 1,
    marginRight: spacing.xs,
    alignItems: "center",
  },
  btnDisabled: { opacity: 0.4 },
  cancelBtn: {
    backgroundColor: colors.danger,
    padding: spacing.sm,
    borderRadius: radius.sm,
    flex: 1,
    marginLeft: spacing.xs,
    alignItems: "center",
  },
  btnText: { color: colors.text.white, textAlign: "center" },
});
