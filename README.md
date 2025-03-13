# Astrology App

## OTA Updates Configuration

This app is configured with Expo OTA (Over-The-Air) updates, allowing you to push updates to your users without requiring them to download a new version from the app store.

### Setup Instructions

1. **Log in to your Expo account** (if not already logged in):
   ```bash
   eas login
   ```

2. **Configure your project with EAS**:
   ```bash
   eas build:configure
   ```

3. **Update the `app.json` file**:
   - Locate your Project ID from your Expo dashboard
   - Replace `YOUR_PROJECT_ID_HERE` in the `updates.url` field with your actual project ID

4. **Create an initial build**:
   For Android:
   ```bash
   eas build --platform android --profile production
   ```
   
   For iOS:
   ```bash
   eas build --platform ios --profile production
   ```

### Publishing Updates

To publish an update to your app:

1. **Make changes to your code**

2. **Preview your changes** (optional):
   ```bash
   eas update:preview
   ```

3. **Publish the update to your production channel**:
   ```bash
   eas update --channel production
   ```

### Testing Updates

To test if your update works correctly:

1. Install the production version of your app on a device
2. Make changes to the app code
3. Run `eas update --channel production`
4. Open the app on your device (or force close and reopen)
5. The app should show an update alert and apply the new changes

### Update Rollback

If you need to roll back to a previous update:

1. **View update history**:
   ```bash
   eas update:list
   ```

2. **Rollback to a specific update**:
   ```bash
   eas update:rollback --updateId [UPDATE_ID]
   ```

### Important Notes

- Updates only apply to JavaScript code and assets
- Native code changes require a new build through the app stores
- Make sure your production build version remains the same for OTA updates to work
- Always test updates before pushing to production
