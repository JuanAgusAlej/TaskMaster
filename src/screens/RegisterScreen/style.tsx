import { StyleSheet } from "react-native";
import { COLORS, FONTS, SPACING } from "../../constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    ...FONTS.logo,
    fontSize: 40,
    color: COLORS.textPrimary,
    lineHeight: 46,
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 8,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    ...FONTS.body,
    marginBottom: SPACING.lg,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 8,
    marginBottom: SPACING.lg,
  },
  passwordInput: {
    flex: 1,
    padding: SPACING.md,
    color: COLORS.textPrimary,
    ...FONTS.body,
  },
  eyeButton: {
    padding: SPACING.md,
  },
  registerButton: {
    marginTop: SPACING.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  loginText: {
    color: COLORS.textSecondary,
    ...FONTS.body,
  },
  loginLink: {
    color: COLORS.accent,
    ...FONTS.body,
    fontWeight: 'bold',
  },
});
