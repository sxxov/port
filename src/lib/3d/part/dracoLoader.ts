import { DRACOLoader } from 'three-stdlib';

export const DRACO_DECODER_URL =
	'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';

/** Global DRACO loader instance */
export const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(DRACO_DECODER_URL);
