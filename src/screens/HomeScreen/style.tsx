import { StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING } from "../../constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50, // basic safe area
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    ...FONTS.title,
    color: COLORS.textPrimary,
  },
  userEmail: {
    ...FONTS.caption,
    color: COLORS.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerBtn: {
    marginLeft: SPACING.sm,
  },
  headerIcon: {
    color: COLORS.accent,
    fontSize: 20,
    lineHeight: 20,
  },
  divider: {
    height: 2,
    backgroundColor: COLORS.accent,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  listContainer: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xl,
    flexGrow: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...FONTS.title,
    color: COLORS.textPrimary,
  },
});
