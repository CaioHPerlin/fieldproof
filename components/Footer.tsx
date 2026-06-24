import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius, spacing } from "../theme";

interface FooterProps {
  children: ReactNode;
  style?: ViewStyle;
}

export function Footer({ children, style }: FooterProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.lg) }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    padding: spacing.md,
    gap: spacing.xs,
  },
});

export const footerStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.success,
    padding: spacing.md,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  primaryText: {
    color: colors.text.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    alignItems: "center",
  },
  linkText: {
    color: colors.link,
    fontWeight: "600",
  },
});
