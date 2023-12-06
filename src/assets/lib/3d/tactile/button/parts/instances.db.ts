export interface Instance {
	position: [x: number, y: number, z: number];
	rotation: [x: number, y: number, z: number, w: number];
	scale: [x: number, y: number, z: number];
}

export const base: Instance[] = [{"position":[0,0,0],"rotation":[0,0,0,1],"scale":[1,1,1]}];
export const pressable: Instance[] = [{"position":[0,0,0],"rotation":[0,0,0,1],"scale":[1,1,1]}];
