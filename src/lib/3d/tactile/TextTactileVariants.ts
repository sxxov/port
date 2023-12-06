import type { Variants } from '@sxxov/sv/common/types';
import type TextTactile from './TextTactile.svelte';
import ttf_bigelow_rules from '../../../assets/lib/3d/tactile/text/BigelowRules-Regular.ttf?url';
import ttf_dm_sans from '../../../assets/lib/3d/tactile/text/DMSans-Regular.ttf?url';

export const TextTactileVariants = {
	Display: {
		Font: {
			sdfGlyphSize: 64,
			font: ttf_bigelow_rules,
			lineHeight: 0.7,
		},
		Dynamic: {
			characters:
				'\x00"#$&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~†°¢•´¨∞¬√«»–—“”‘’÷⁄‹›‡·‚„ˆ˜¯˘˙˚¸˝˛ˇß¶µ¥€≈æøØ≠ÆŒœ¡¿ÐŁłÞþ§ªº£%¹²³¾½¼©®™∂ð±‰ŠšÝýŽžÀÃÕÿŸıÒÚÛÙÂÊÁËÈÍÎÏÌÓÔÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü…ﬁﬂ ȷ¤­̦̒̕ĀĂĄĆĈĊČĎĐĒĔĖĘĚĜĞĠĢĤĦĨĪĬĮİĲĴĶĹĻĿĽŃŅŇŊŌŎŐŔŖŘŚŜŞŢŤŦŨŪŬŮŰŲŴẀẂẄŶỲŹŻǼǾāăąćĉċčďđēĕėęěĝğġģĥħĩīĭįĳĵķĸĺļŀľńņňŉŋōŏőŕŗřśŝşţťŧũūŭůűųŵẁẃẅŷỳźżǽǿ×¦−!',
		},
	},
	Sans: {
		Font: {
			sdfGlyphSize: 64,
			font: ttf_dm_sans,
		},
		Dynamic: {
			characters:
				'\x00AÁĂÂÄÀĀĄÅÃÆǼBCĆČÇĊDĎĐÐEÉĔĚÊËĖÈĒĘẼƏFGĞĢĠHĦIĲÍĬÎÏİÌĪĮĨJKĶLĹĽĻĿŁMNŃŇŅÑŊOÓŎÔÖÒŐŌØÕŒPÞQRŔŘŖSŚŠŞȘẞTŤŢȚUÚŬÛÜÙŰŪŲŮŨVWẂŴẄẀXYÝŶŸỲỸZŹŽŻ\x00aáăâäàāąåãæǽbcćčçċdďđðeéĕěêëėèēęẽəfgğģġhħiıíĭîï\x00ìīįĩĳjȷkķlĺľļŀłmnńňņñŋoóŏôöòőōøõœpþqrŕřŗsśšşșßtťţțuúŭûüùűūųůũvwẃŵẅẁxyýŷÿỳỹzźžż\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00ﬁﬂªºπ0123456789\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00⁄½¼¾¹²³⁴  \r.,:;…!¡?¿·•*#/\\\x00\x00-–—_(){}[]‚„“”‘’«»‹›"\'\x00\x00\x00\x00\x00\x00\x00\x00ƒ@&¶§©®™°|¦ℓ†‡℮¢¤$€₺₽₨₹£¥∕+−×÷=≠><≥≤±≈~¬^∞∫Ω∆∏∑√µ∂%‰↑↗→↘↓↙←↖↔↕\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00◊̈̇̀́̋\x00̧̨̦̂̌̆̊̃̄̒\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00¨˙`´˝ˆˇ˘˚˜¯¸˛',
		},
	},
} satisfies Variants<TextTactile>;
