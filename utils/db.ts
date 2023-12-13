const kv = await Deno.openKv();

interface User {
  id: string;
  name: string;
  games: Object[];
}
// We need to tackle what it means to have users with two names and how to handle that

export function getUsers() {
  // Give me all of the uesrs
  return kv.list<User>({ prefix: ["users"] });
}

export async function getUser(name: string) {
  // Give me a specific user
  const res = await kv.get<User>(["users", name]);
  return res.value;
}

// We could also figure this out later rather than now and just keep it name based
// export async function getUserIdByName(name: string){
//   // Get the id of a user
//   const res = await kv.get<User>(["users", name]);
//   if (res.value) return res.value.id
//   return null
// }

export async function createUser(name: string) {
  // Create a new user
  // Keeping id here for easier changes later if this were to be used by more than me

  // We need to first determine if this user exists
  // We need to define this further to specify that this user exists in the database
  if (await getUser(name)) return null;

  const id = Math.random().toString(36).substring(2);
  const res = await kv.set(["users", name], { id, name, games: [] });
  if (res.ok) return res;
  else return null;
}
