import { ModalProps, Modal as RNModal, StyleSheet, View, ViewStyle } from "react-native";
import { colors, radius, spacing } from "../theme";

type Props = ModalProps & {
  containerStyle?: ViewStyle;
  overlayDark?: boolean;
};

export function Modal({ children, containerStyle, overlayDark, ...props }: Props) {
  return (
    <RNModal transparent animationType="fade" {...props}>
      <View style={[styles.overlay, overlayDark && styles.overlayDark]}>
        <View style={[styles.container, containerStyle]}>{children}</View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.overlay,
  },
  overlayDark: {
    backgroundColor: colors.overlayDark,
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
});
