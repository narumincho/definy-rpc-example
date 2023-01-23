import { serve } from "https://deno.land/std@0.173.0/http/server.ts";
import {
  DefinyRpcParameter,
  handleRequest,
} from "https://raw.githubusercontent.com/narumincho/definy/593ae02fdb954466b9c0be5e52770567648f470b/deno-lib/definyRpc/server/definyRpc.ts";
import * as coreType from "https://raw.githubusercontent.com/narumincho/definy/593ae02fdb954466b9c0be5e52770567648f470b/deno-lib/definyRpc/core/coreType.ts";
import { requestObjectToSimpleRequest } from "https://raw.githubusercontent.com/narumincho/definy/593ae02fdb954466b9c0be5e52770567648f470b/deno-lib/simpleRequestResponse/simpleRequest.ts";
import { simpleResponseToResponse } from "https://raw.githubusercontent.com/narumincho/definy/593ae02fdb954466b9c0be5e52770567648f470b/deno-lib/simpleRequestResponse/simpleResponse.ts";

serve(
  async (request) => {
    const parameter: DefinyRpcParameter = {
      name: "example",
      all: () => ({
        functionsList: [],
        typeList: [
          coreType.DefinyRpcTypeInfo.from({
            name: "AccountType",
            attribute: coreType.Maybe.nothing(),
            description: "アカウントのタイプ",
            parameter: [],
            namespace: coreType.Namespace.local(["custom"]),
            body: coreType.TypeBody.sum([
              coreType.Pattern.from({
                name: "human",
                description: "人間. パラメーターには身長 (mm)",
                parameter: coreType.Maybe.just(coreType.Number.type()),
              }),
              coreType.Pattern.from({
                name: "bot",
                description:
                  "ボット．パラメーターには書き込みを許可しているかをしていする．trueで許可をしている",
                parameter: coreType.Maybe.just(coreType.Bool.type()),
              }),
            ]),
          }),
        ],
      }),
      originHint: new URL(request.url).origin,
      codeGenOutputFolderPath: new URL("./generated/", import.meta.url),
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
