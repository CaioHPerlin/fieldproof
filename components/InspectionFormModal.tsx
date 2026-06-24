import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { insertInspection, updateInspection } from "../repositories/inspectionRepository";
import { Inspection } from "../types/inspection";
import { suggestCurrentAddress } from "../utils/geocoding";
import { FormField } from "./FormField";

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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
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
              📍 {latitude.toFixed(6)}, {longitude.toFixed(6)}
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
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
  },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  coords: { fontSize: 12, color: "#888", textAlign: "center", marginBottom: 12 },
  buttons: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  saveBtn: {
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 4,
    flex: 1,
    marginRight: 5,
  },
  btnDisabled: { opacity: 0.5 },
  cancelBtn: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 4,
    flex: 1,
    marginLeft: 5,
  },
  btnText: { color: "#fff", textAlign: "center" },
});
