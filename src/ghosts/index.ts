import { Ghost } from "./Ghost";
import { AZ1 } from "./personalities/AZ1";

const ghostRegistry: { [key: string]: Ghost } = {
  az1: new AZ1()
};

export function getGhost(id: string): Ghost {
  return ghostRegistry[id] || ghostRegistry.az1;
}

export { Ghost };
