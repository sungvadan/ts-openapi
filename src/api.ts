import { components, paths } from "./types/schema";

type PickDefiend<Object> = Pick<
  Object,
  {
    [Key in keyof Object]: Object[Key] extends undefined ? undefined : Key;
  }[keyof Object]
>;
type FetchOptions<Method, Query, Params> = RequestInit & {
  method: Method;
} & PickDefiend<{ query: Query }> &
  PickDefiend<{ params: Params }>;

// condition type
type ResponseWithStatus<Status extends number> = {
  responses: Record<Status, { content: { "application/json": any } }>;
};
type SuccessResponse<Endpoint> = Endpoint extends ResponseWithStatus<200>
  ? Endpoint["responses"][200]["content"]["application/json"]
  : Endpoint extends ResponseWithStatus<201>
  ? Endpoint["responses"][201]["content"]["application/json"]
  : null;

type QueryParameter<Endpoint> = Endpoint extends {
  parameters: { query: object };
}
  ? Endpoint["parameters"]["query"]
  : undefined;
type PathParameter<Endpoint> = Endpoint extends { parameters: { path: object } }
  ? Endpoint["parameters"]["path"]
  : undefined;

export async function fetchApi<
  Path extends keyof paths,
  Method extends keyof paths[Path]
>(
  path: Path,
  options: FetchOptions<
    Method,
    QueryParameter<paths[Path][Method]>,
    PathParameter<paths[Path][Method]>
  >
): Promise<SuccessResponse<paths[Path][Method]>> {
  return await fetch(path, options).then((res) => res.json());
}

type a = PickDefiend<{ a: 2; c: "sdfzdsf"; b: undefined }>;

async function DemoDebug() {
  const data = await fetchApi("/pet/{petId}", {
    method: "get",
    params: { petId: 3 },
  });
}
