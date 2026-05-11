import { StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING } from "../../constants/theme";

export const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButton: {
    backgroundColor: COLORS.accent,
  },
  primaryText: {
    color: COLORS.background,
    ...FONTS.title,
    fontSize: 16,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  outlineText: {
    color: COLORS.accent,
    ...FONTS.title,
    fontSize: 16,
  },
  dangerButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  dangerText: {
    color: COLORS.danger,
    ...FONTS.title,
    fontSize: 16,
  },
  iconButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  iconText: {
    color: COLORS.accent,
  }
});
