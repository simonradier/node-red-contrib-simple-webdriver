import { NodeAPI, NodeAPISettingsWithData } from 'node-red'

export class REDAPI {
  private static instance: NodeAPI<NodeAPISettingsWithData>

  public static get(): NodeAPI<NodeAPISettingsWithData> {
    return REDAPI.instance
  }

  public static set(redAPI: NodeAPI<NodeAPISettingsWithData>): void {
    REDAPI.instance = redAPI
  }
}
