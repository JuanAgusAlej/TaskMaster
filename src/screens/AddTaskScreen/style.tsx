import { StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING } from "../../constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.lg,
  },
  backButton: {
    borderWidth: 0,
    paddingHorizontal: 0,
  },
  backButtonText: {
    color: COLORS.textSecondary,
    ...FONTS.body,
  },
  headerTitle: {
    ...FONTS.title,
    color: COLORS.textPrimary,
  },
  placeholder: {
    width: 60,
  },
  formContainer: {
    paddingHorizontal: SPACING.md,
    flexGrow: 1,
  },
  titleInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 8,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    ...FONTS.title,
    marginBottom: SPACING.md,
  },
  descriptionInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 8,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    ...FONTS.body,
    height: 150,
    marginBottom: SPACING.lg,
  },
  reminderInfo: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.accentMuted,
  },
  reminderText: {
    color: COLORS.accent,
    ...FONTS.body,
    marginBottom: SPACING.sm,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateBtn: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
    borderRadius: 8,
    marginHorizontal: SPACING.xs,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.accentMuted,
  },
  dateBtnText: {
    color: COLORS.textPrimary,
    ...FONTS.body,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
  },
  footerBtn: {
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.xs,
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accent,
  },
  radioText: {
    ...FONTS.body,
    color: COLORS.textPrimary,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.accentMuted,
    borderRadius: 8,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  durationInput: {
    color: COLORS.textPrimary,
    ...FONTS.title,
    flex: 1,
    textAlign: 'center',
  },
  durationLabel: {
    color: COLORS.textSecondary,
    ...FONTS.caption,
    marginLeft: 2,
  }
});
