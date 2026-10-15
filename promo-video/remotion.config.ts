import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(95);
Config.setCrf(18);
Config.setPixelFormat('yuv420p');
Config.setConcurrency(4);
// Cloud containers ship Playwright's headless shell; locally Remotion downloads its own.
if (process.env.REMOTION_BROWSER) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
}
