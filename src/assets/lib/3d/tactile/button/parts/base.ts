import base_bin from './base.bin?url';
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
			"name": "base"
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
			"name": "Cylinder.004",
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
			"count": 140,
			"max": [
				0.6412249803543091,
				0.6265469789505005,
				0.21330100297927856
			],
			"min": [
				-0.6383230090141296,
				-0.6228929758071899,
				0.04769499972462654
			],
			"type": "VEC3"
		},
		{
			"componentType": 5126,
			"count": 140,
			"type": "VEC3"
		},
		{
			"componentType": 5126,
			"count": 140,
			"type": "VEC2"
		},
		{
			"componentType": 5123,
			"count": 264,
			"type": "SCALAR"
		}
	],
	"bufferViews": [
		{
			"buffer": 0,
			"byteLength": 1334,
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
			"byteLength": 1336,
			"uri": base_bin
		}
	]
}