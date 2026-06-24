import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { insertInspection, updateInspection } from "../repositories/inspectionRepository";
import { colors, radius, spacing } from "../theme";
import { Inspection } from "../types/inspection";
import { formatCoordinate } from "../utils/formatter";
import { suggestCurrentAddress } from "../utils/geocoding";
import { FormField } from "./FormField";
import { Modal } from "./Modal";

type Props = {
  visible: boolean;
  onClose: () => void;
  onInspectionCreated: () => void;
  inspection: Inspection | null;
};

export function InspectionFormModal({ visible, onClose, onInspectionCreated, inspection }: Props) {
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const db = useSQLiteContext();

  const isEditing = !!inspection;

  useEffect(() => {
    if (!visible) return;

    if (isEditing) {
      setTitle(inspection.title);
      setAddress(inspection.address);
      setLatitude(inspection.latitude);
      setLongitude(inspection.longitude);
      return;
    }

    setTitle("");
    setAddress("");
    setLatitude(null);
    setLongitude(null);
    fetchLocation();
  }, [visible]);

  const fetchLocation = async () => {
    setLoadingLocation(true);
    try {
      const resolved = await suggestCurrentAddress();
      if (resolved) {
        setAddress(resolved.address ?? "");
        setLatitude(resolved.latitude);
        setLongitude(resolved.longitude);
      }
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert("Campo obrigatório", "Informe o nome do estabelecimento.");
      return;
    }
    if (!address.trim()) {
      Alert.alert("Campo obrigatório", "Informe o endereço.");
      return;
    }

    try {
      if (isEditing) {
        await updateInspection(db, inspection!.id, {
          title,
          address,
          latitude,
          longitude,
          date: inspection.date,
        });
      } else {
        await insertInspection(db, {
          title,
          address,
          latitude,
          longitude,
          date: new Date().toISOString(),
        });
      }
      onInspectionCreated();
      onClose();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar a inspeção.");
    }
  };

  return (
    <Modal visible={visible} onRequestClose={onClose} containerStyle={{ width: "90%" }}>
      <Text style={styles.header}>{isEditing ? "Editar Inspeção" : "Nova Inspeção"}</Text>

      <FormField
        label="Nome do estabelecimento"
        placeholder="Ex: Farmácia Central, Obra Rua XV"
        value={title}
        onChangeText={setTitle}
        editable={!loadingLocation}
      />

      <FormField
        label="Endereço"
        placeholder={loadingLocation ? "Obtendo localização..." : "Endereço"}
        value={address}
        onChangeText={setAddress}
        editable={!loadingLocation}
      />

      {latitude != null && longitude != null && (
        <Text style={styles.coords}>
          📍 {formatCoordinate(latitude)}, {formatCoordinate(longitude)}
        </Text>
      )}

      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveBtn, loadingLocation && styles.btnDisabled]}
          disabled={loadingLocation}
        >
          <Text style={styles.btnText}>{isEditing ? "Atualizar" : "Salvar"}</Text>
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
    marginBottom: spacing.md,
  },
  coords: {
    fontSize: 12,
    color: colors.text.muted,
    textAlign: "center",
    marginBottom: spacing.md,
  },
  buttons: { flexDirection: "row", justifyContent: "space-between", marginTop: spacing.xs },
  saveBtn: {
    backgroundColor: colors.success,
    padding: spacing.sm,
    borderRadius: radius.sm,
    flex: 1,
    marginRight: spacing.xs,
    alignItems: "center",
  },
  btnDisabled: { opacity: 0.5 },
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
