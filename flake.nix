{
  description = "Fixed Calendar Bun app packaged with Nix";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
      ];
      forEachSystem = f:
        nixpkgs.lib.genAttrs systems (system: f system (import nixpkgs { inherit system; }));
    in {
      packages = forEachSystem (system: pkgs:
        let
          pname = "fixed-calendar";
          bun = pkgs.bun;
          srcFiltered = pkgs.lib.cleanSource self;
        in {
          ${pname} = pkgs.stdenvNoCC.mkDerivation {
            inherit pname;
            version = (self.lastModifiedDate or "0") + "+git";
            src = srcFiltered;

            nativeBuildInputs = [ bun ];

            buildPhase = ''
              export HOME=$TMPDIR
              bun --version
              bun run build
            '';

            installPhase = ''
              runHook preInstall
              appshare=$out/share/${pname}
              mkdir -p "$appshare" "$out/bin"
              # Server and built assets
              cp server.js "$appshare/"
              cp -r dist "$appshare/"

              # Start wrapper that sets PORT and serves from dist
              cat > "$out/bin/${pname}-start" <<'EOF'
              #!/usr/bin/env bash
              set -euo pipefail
              PORT="''${PORT:-''${APP_PORT:-3000}}"
              export PORT
              # Resolve to store paths at build-time
              exec "@bun@/bin/bun" "@appshare@/server.js" --root "@appshare@/dist"
              EOF
              substituteInPlace "$out/bin/${pname}-start" \
                --subst-var-by bun ${bun} \
                --subst-var-by appshare "$appshare"
              chmod +x "$out/bin/${pname}-start"
              runHook postInstall
            '';

            meta = with pkgs.lib; {
              description = "International Fixed Calendar app (Bun)";
              license = licenses.mit;
              platforms = systems;
            };
          };

          default = self.packages.${system}.${pname};
        });

      apps = forEachSystem (system: pkgs: {
        start = {
          type = "app";
          program = "${self.packages.${system}.fixed-calendar}/bin/fixed-calendar-start";
        };
        default = self.apps.${system}.start;
      });

      devShells = forEachSystem (system: pkgs: {
        default = pkgs.mkShell {
          packages = [ pkgs.bun ];
        };
      });
    };
}
