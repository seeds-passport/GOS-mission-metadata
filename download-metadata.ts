import fetch from "node-fetch";
import pino from "pino";
import fs from "fs";
import stream from "stream";

//#region logger config
const dest = new stream.PassThrough();
dest.pipe(process.stdout);
dest.pipe(fs.createWriteStream("pino.log", { flags: "a" }));
const logger = pino({ level: "info" }, dest);
//#endregion

const sourceUrl =
  "https://omosuite.dstudio.earth/api/v0/aql/public/passport-missions--public?programSlug=GOS";
const destFolder = "data";

if (!fs.existsSync(destFolder)) {
  fs.mkdirSync(destFolder);
}

(async () => {
  let data = await fetch(sourceUrl).then((res) => res.json());
  data.forEach((m) => {
    fs.writeFileSync(
      `${destFolder}/${m.thumbnail__filename}`,
      m.thumbnail__string
    );
    fs.writeFileSync(
      `${destFolder}/${m.transcript__filename}`,
      m.transcript__string
    );
  });
  let payload = data.map((m) => {
    let {
      name,
      completion,
      activation,
      is_required,
      parent_mission_name,
      metadata,
      cta,
    } = m;
    return { name, completion, activation, is_required, parent_mission_name, metadata, cta };
  });
  fs.writeFileSync(`${destFolder}/_data.json`, JSON.stringify(payload, null, 2));
})();
