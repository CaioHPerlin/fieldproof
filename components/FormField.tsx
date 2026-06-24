import { ComponentProps } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type FormFieldProps = {
  label: string;
} & ComponentProps<typeof TextInput>;

export function FormField({ label, style, ...rest }: FormFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={[styles.input, style]} {...rest} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 10 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 4, color: "#333" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 4, padding: 8 },
});
