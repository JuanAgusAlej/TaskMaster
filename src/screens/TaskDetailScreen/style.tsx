import { StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING } from "../../constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...FONTS.title,
    color: COLORS.danger,
    marginBottom: SPACING.md,
  },
  header: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
    alignItems: 'flex-start',
  },
  backButton: {
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  backButtonText: {
    color: COLORS.textSecondary,
    ...FONTS.body,
  },
  content: {
    paddingHorizontal: SPACING.xl,
  },
  title: {
    ...FONTS.logo,
    fontSize: 32,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  divider: {
    height: 2,
    backgroundColor: COLORS.accent,
    marginBottom: SPACING.lg,
  },
  description: {
    ...FONTS.body,
    color: COLORS.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  infoBox: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.accentMuted,
    marginBottom: SPACING.md,
  },
  infoTitle: {
    ...FONTS.title,
    color: COLORS.accent,
    marginBottom: SPACING.xs,
  },
  infoText: {
    ...FONTS.body,
    color: COLORS.textPrimary,
  },
  statusBox: {
    marginTop: SPACING.lg,
  },
  statusTitle: {
    ...FONTS.title,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  statusBtn: {
    alignSelf: 'flex-start',
  },
  statusIcon: {
    fontSize: 18,
    color: COLORS.accent,
  },
  completedStaticBox: {
    backgroundColor: COLORS.accent,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedStaticText: {
    color: COLORS.background,
    ...FONTS.title,
    fontSize: 16,
    marginLeft: SPACING.sm,
  },
  detailImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginTop: SPACING.sm,
    resizeMode: 'cover',
  },
});
