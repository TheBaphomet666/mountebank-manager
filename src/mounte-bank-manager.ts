import axios, { AxiosResponse } from 'axios';
import { create } from 'mountebak-secure';

import { buildStub } from './imposter-builder';

/**
 *  Mounte bank manager to handle imposters for testing
 *  @class
 */
export class MounteBankManager {
  private host: string = 'http://localhost';
  private port: string = '2525';
  private url: string = `${this.host}:${this.port}/imposters`;
  private mb;

  /**
   * Starts the Mountebank server and builds default imposters.
   */
  async startMountebank(): Promise<void> {
    this.mb = await create({});
    console.log(`Mountebank started at ${this.url}`);
  }

  /**
   * Creates an imposter with the given stubs on the specified service port.
   * @param stubs
   * @param servicePort
   */
  async createImposter(stubs, servicePort: string): Promise<any> {
    const imposter = {
      port: servicePort,
      protocol: 'http',
      recordRequests: true,
      stubs
    };

    return await this.postImposter(imposter);
  }

  /**
   * Posts an imposter to the Mountebank server.
   * @param body
   * @private
   */
  private async postImposter(body): Promise<AxiosResponse> {
    return await axios.post(this.url, JSON.stringify(body), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

    /**
     * Deletes an imposter on the specified service port.
     * @param servicePort
     */
    async deleteImposter(servicePort: string): Promise<void> {
        await axios.delete(`${this.url}/${servicePort}`);
    }

    /**
     * Deletes an imposter on the specified service port.
     * @param servicePort
     */
    async clearAllImposters(): Promise<void> {
        await axios.delete(this.url);
    }

  /**
   * Stops the Mountebank server and removes all imposters.
   */
  async stopMountebank(): Promise<void> {
    await this.clearAllImposters();
    return await this.mb.close(() => {
      /* empty */
    });
  }
}

export const mounteBankManager = new MounteBankManager();
