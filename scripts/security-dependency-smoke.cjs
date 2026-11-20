// Exercise the consumers affected by scoped security resolutions and the Metro patch.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const net = require('node:net');
const os = require('node:os');
const path = require('node:path');
const { createRequire } = require('node:module');

const root = path.resolve(__dirname, '..');
const exampleRequire = createRequire(path.join(root, 'example/package.json'));
const fromPackage = (name) => createRequire(require.resolve(name));

async function verifyFtpDownload() {
  const { getUri } = require('get-uri');
  let dataSocket;
  const dataServer = net.createServer((socket) => {
    dataSocket = socket;
  });
  await new Promise((resolve) => dataServer.listen(0, '127.0.0.1', resolve));
  const server = net.createServer((socket) => {
    // basic-ftp closes the control connection after the completed download.
    socket.on('error', (error) => {
      if (error.code !== 'ECONNRESET') throw error;
    });
    socket.write('220 test FTP server\r\n');
    let pending = '';
    socket.on('data', (chunk) => {
      pending += chunk;
      let end;
      while ((end = pending.indexOf('\r\n')) !== -1) {
        const command = pending.slice(0, end).split(' ')[0];
        pending = pending.slice(end + 2);
        if (command === 'USER') socket.write('331 password required\r\n');
        else if (command === 'PASS') socket.write('230 logged in\r\n');
        else if (command === 'FEAT') socket.write('211 no features\r\n');
        else if (command === 'MDTM') socket.write('213 20261119000000\r\n');
        else if (command === 'EPSV')
          socket.write(
            `229 Entering Extended Passive Mode (|||${
              dataServer.address().port
            }|)\r\n`
          );
        else if (command === 'RETR') {
          socket.write('150 opening data connection\r\n');
          dataSocket.end('security dependency smoke');
          socket.write('226 transfer complete\r\n');
        } else if (command === 'QUIT') socket.end('221 bye\r\n');
        else socket.write('200 OK\r\n');
      }
    });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const stream = await getUri(
      `ftp://127.0.0.1:${server.address().port}/test.txt`,
      { timeout: 3000 }
    );
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    assert.equal(Buffer.concat(chunks).toString(), 'security dependency smoke');
  } finally {
    dataServer.close();
    server.close();
  }
}

async function main() {
  const xcode = require('xcode');
  const project = xcode.project(
    path.join(
      root,
      'example/ios/VisionCameraMLKitExample.xcodeproj/project.pbxproj'
    )
  );
  project.parseSync();
  assert.match(project.generateUuid(), /^[0-9A-F]{24}$/);
  assert.ok(project.getFirstTarget().uuid);

  const android = require('@react-native-community/cli-config-android/build/config/getAndroidProject');
  const manifest = fs.readFileSync(
    path.join(root, 'example/android/app/src/main/AndroidManifest.xml'),
    'utf8'
  );
  const { XMLParser } = fromPackage(
    '@react-native-community/cli-config-android'
  )('fast-xml-parser');
  assert.ok(new XMLParser().parse(manifest).manifest.application);
  assert.equal(
    android.parsePackageNameFromAndroidManifestFile(
      '<manifest package="com.example.security"/>'
    ),
    'com.example.security'
  );
  const appleParser = fromPackage('@react-native-community/cli-platform-apple')(
    'fast-xml-parser'
  );
  const scheme = fs.readFileSync(
    path.join(
      root,
      'example/ios/VisionCameraMLKitExample.xcodeproj/xcshareddata/xcschemes/VisionCameraMLKitExample.xcscheme'
    ),
    'utf8'
  );
  assert.ok(new appleParser.XMLParser().parse(scheme).Scheme.BuildAction);

  const temp = fs.mkdtempSync(
    path.join(os.tmpdir(), 'mlkit-dependency-smoke-')
  );
  try {
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aP1sAAAAASUVORK5CYII=',
      'base64'
    );
    const image = path.join(temp, 'pixel.png');
    fs.writeFileSync(image, png);
    const metroRoot = path.dirname(
      exampleRequire.resolve('metro/package.json')
    );
    const assets = require(path.join(metroRoot, 'src/Assets.js'));
    assert.deepEqual(assets.getAssetSize('png', png, image), {
      width: 1,
      height: 1,
    });
    const asset = await assets.getAssetData(
      image,
      'pixel.png',
      [],
      'ios',
      '/assets'
    );
    assert.equal(asset.width, 1);
    assert.equal(asset.height, 1);
    for (const name of ['@expo/config-plugins', 'react-native-builder-bob']) {
      const { glob } = fromPackage(name)('glob');
      assert.deepEqual(await glob('*.png', { cwd: temp }), ['pixel.png']);
    }
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
  for (const name of [
    '@ts-morph/common',
    '@typescript-eslint/typescript-estree',
  ]) {
    const { minimatch } = fromPackage(name)('minimatch');
    assert.ok(minimatch('src/index.ts', '**/*.ts'));
  }
  await verifyFtpDownload();
  console.log('Dependency consumer compatibility checks passed.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
