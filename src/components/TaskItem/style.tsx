import { StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING } from "../../constants/theme";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.accent,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  checkboxContainer: {
    marginRight: SPACING.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.accent,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.accent,
  },
  checkmark: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  title: {
    ...FONTS.title,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.textSecondary,
  },
  body: {
    ...FONTS.body,
    color: COLORS.textSecondary,
  },
  assignedText: {
    ...FONTS.caption,
    color: COLORS.accent,
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.background,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  actionBtn: {
    marginLeft: SPACING.sm,
    borderColor: COLORS.accentMuted,
  },
  deleteBtn: {
    borderColor: COLORS.danger,
  },
  actionIcon: {
    fontSize: 16,
    color: COLORS.textPrimary,
  }
});