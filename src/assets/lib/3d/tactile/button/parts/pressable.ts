import pressable_bin from './pressable.bin?url';
import buttonTexture_png from './buttonTexture.png?url';

export default {
	"asset": {
		"generator": "Khronos glTF Blender I/O v3.6.27",
		"version": "2.0"
	},
	"extensionsUsed": [
		"KHR_draco_mesh_compression"
	],
	"extensionsRequired": [
		"KHR_draco_mesh_compression"
	],
	"scene": 0,
	"scenes": [
		{
			"name": "Scene",
			"nodes": [
				0
			]
		}
	],
	"nodes": [
		{
			"mesh": 0,
			"name": "pressable"
		}
	],
	"materials": [
		{
			"doubleSided": true,
			"name": "Material.003",
			"pbrMetallicRoughness": {
				"baseColorTexture": {
					"index": 0
				},
				"metallicFactor": 0,
				"roughnessFactor": 0.6900347471237183
			}
		}
	],
	"meshes": [
		{
			"name": "Cylinder.003",
			"primitives": [
				{
					"attributes": {
						"POSITION": 0,
						"NORMAL": 1,
						"TEXCOORD_0": 2
					},
					"extensions": {
						"KHR_draco_mesh_compression": {
							"bufferView": 0,
							"attributes": {
								"POSITION": 0,
								"NORMAL": 1,
								"TEXCOORD_0": 2
							}
						}
					},
					"indices": 3,
					"material": 0,
					"mode": 4
				}
			]
		}
	],
	"textures": [
		{
			"sampler": 0,
			"source": 0
		}
	],
	"images": [
		{
			"mimeType": "image/png",
			"name": "buttonTexture",
			"uri": buttonTexture_png
		}
	],
	"accessors": [
		{
			"componentType": 5126,
			"count": 160,
			"max": [
				0.4761109948158264,
				0.4761109948158264,
				0.1014380007982254
			],
			"min": [
				-0.4761109948158264,
				-0.4761109948158264,
				-0.1053381934762001
			],
			"type": "VEC3"
		},
		{
			"componentType": 5126,
			"count": 160,
			"type": "VEC3"
		},
		{
			"componentType": 5126,
			"count": 160,
			"type": "VEC2"
		},
		{
			"componentType": 5123,
			"count": 282,
			"type": "SCALAR"
		}
	],
	"bufferViews": [
		{
			"buffer": 0,
			"byteLength": 1151,
			"byteOffset": 0
		}
	],
	"samplers": [
		{
			"magFilter": 9729,
			"minFilter": 9987
		}
	],
	"buffers": [
		{
			"byteLength": 1152,
			"uri": pressable_bin
		}
	]
}