import { StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING } from "../../constants/theme";

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
    marginBottom: SPACING.md,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  styleActiveTab: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.accent,
  },
  styleTabText: {
    ...FONTS.title,
    color: COLORS.textSecondary,
    fontSize: 16,
  },
  activeTabText: {
    color: COLORS.accent,
  },
});