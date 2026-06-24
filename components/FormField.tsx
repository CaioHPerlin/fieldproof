import { ComponentProps } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors, radius, spacing } from "../theme";

type FormFieldProps = {
  label: string;
} & ComponentProps<typeof TextInput>;

export function FormField({ label, style, ...rest }: FormFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={[styles.input, style]} placeholderTextColor={colors.text.muted} {...rest} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.sm },
  label: { fontSize: 14, fontWeight: "600", marginBottom: spacing.xs, color: colors.text.primary },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: spacing.xs,
  },
});
