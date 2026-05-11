import { StyleSheet } from "react-native";
import { COLORS, SPACING } from "../../constants/theme";

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
  checkboxSkeleton: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: COLORS.background, // Using background color inside surface to mimic empty states
    marginRight: SPACING.md,
  },
  textContainer: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  titleSkeleton: {
    height: 20,
    width: '60%',
    backgroundColor: COLORS.background,
    borderRadius: 4,
    marginBottom: 8,
  },
  bodySkeleton: {
    height: 14,
    width: '90%',
    backgroundColor: COLORS.background,
    borderRadius: 4,
  }
});
