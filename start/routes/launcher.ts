import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'

/**
 * Requete fait par le launcher pour savoir si une mise à jour est disponible en ce basant sur le fichier manifest
 * {{currentVersion}}: La version de l'application qui demande la mise à jour.
 * {{os}}: Le nom du système d'exploitation (l'un des linux, windows ou darwin).
 * {{archSystem}}: L'architecture de la machine (l'un des x86_64, i686, aarch64 ou armv7).
 */
router.get('/launcher/updater-manifest/:os/:archSystem/:currentVersion', [
  controllers.LauncherCrz,
  'checkIsAvailableVersionLauncher',
])

/**
 * Requête pour la mise à jour du launcher ou pour le
 * telechargement du launcher pour la premiere fois (via le siteweb)
 * {{nameBundle}}: CrzGamesSetup_x64.msi.zip (updaterbundle), CrzGamesSetup_x64.msi (standardappbundle) ..
 */
router.get('/launcher/download/:nameBundle', [controllers.LauncherCrz, 'downloadLauncher'])
