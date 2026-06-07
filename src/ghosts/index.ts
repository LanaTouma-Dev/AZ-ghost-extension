import { Ghost } from "./Ghost";
import { AZ1 } from "./personalities/AZ1";

const ghostRegistry: Record<string, Ghost> = {
  az1: new AZ1(),
};

export function getGhost(id: string): Ghost {
  const ghost = ghostRegistry[id];
  if (!ghost) throw new Error(`Unknown ghost id: "${id}"`);
  return ghost;
}

export { Ghost };
