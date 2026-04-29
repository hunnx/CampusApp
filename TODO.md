# TODO: Fix ReferenceError "colors" does not exist

## Plan Breakdown
- [x] Step 1: Edit src/screens/student/StudentHomeScreen.js
  - Uncomment useTheme import ✓
  - Add const { colors } = useTheme(); ✓
  - Add missing TouchableOpacity import ✓
- [x] Step 2: Test the app (run metro and device/emulator)
  - Fixed StudentHomeScreen.js - colors now accessible via useTheme()
  - Added TouchableOpacity import
  - Check console for remaining errors
- [x] Step 3: Check for other similar errors in other screens/components
  - Analyzed with search_files: 24 files already use useTheme() correctly (ModernCard.js, CustomTabBar.js, etc.)
  - StudentHomeScreen.js was the only one missing it among checked files.
  - No immediate other ReferenceErrors expected for "colors".
- [x] Step 4: Complete task

