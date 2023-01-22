import { serve } from "https://deno.land/std@0.173.0/http/server.ts";
import {
  DefinyRpcParameter,
  handleRequest,
} from "https://raw.githubusercontent.com/narumincho/definy/593ae02fdb954466b9c0be5e52770567648f470b/deno-lib/definyRpc/server/definyRpc.ts";
import { requestObjectToSimpleRequest } from "https://raw.githubusercontent.com/narumincho/definy/593ae02fdb954466b9c0be5e52770567648f470b/deno-lib/simpleRequestResponse/simpleRequest.ts";
import { simpleResponseToResponse } from "https://raw.githubusercontent.com/narumincho/definy/593ae02fdb954466b9c0be5e52770567648f470b/deno-lib/simpleRequestResponse/simpleResponse.ts";

serve(
  async (request) => {
    const parameter: DefinyRpcParameter = {
      name: "example",
      all: () => ({
        functionsList: [],
        typeList: [],
      }),
      originHint: new URL(request.url).origin,
      codeGenOutputFolderPath: undefined,
    };
    const simpleRequest = await requestObjectToSimpleRequest(request);
    if (simpleRequest === undefined) {
      return new Response("simpleRequestに変換できなかった", { status: 400 });
    }
    const simpleResponse = await handleRequest(
      parameter,
      simpleRequest,
    );
    if (simpleResponse === undefined) {
      return new Response("特に処理すること必要がないリクエストだった", {
        status: 404,
      });
    }
    return simpleResponseToResponse(simpleResponse);
  },
  { hostname: "[::1]", port: 8000 },
);
