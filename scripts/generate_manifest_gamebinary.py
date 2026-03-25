#!/usr/bin/env python3
import os
import sys
import json
import hashlib
import argparse


DEFAULT_VERSION = "v1.0.0"
DEFAULT_OUTPUT = "manifest.json"


def sha256_file(path: str) -> str:
    hasher = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            hasher.update(chunk)
    return hasher.hexdigest()


def build_manifest(root: str, version: str, output_name: str, include_output: bool) -> dict:
    root = os.path.abspath(root)
    output_path = os.path.abspath(os.path.join(root, output_name))

    files = []

    for base, dirs, filenames in os.walk(root):
        dirs.sort()
        filenames.sort()

        for filename in filenames:
            full_path = os.path.abspath(os.path.join(base, filename))

            if not include_output and full_path == output_path:
                continue

            rel_path = os.path.relpath(full_path, root).replace("\\", "/")
            size = os.path.getsize(full_path)
            file_hash = sha256_file(full_path)

            files.append({
                "name": rel_path,
                "hash": file_hash,
                "size": size
            })

    return {
        "version": version,
        "files": files
    }


def main():
    parser = argparse.ArgumentParser(
        description="Genere un manifest JSON recursif avec name, hash SHA-256 et size."
    )
    parser.add_argument(
        "folder",
        help="Dossier racine a scanner"
    )
    parser.add_argument(
        "-v", "--version",
        default=DEFAULT_VERSION,
        help=f"Version du manifest (defaut: {DEFAULT_VERSION})"
    )
    parser.add_argument(
        "-o", "--output",
        default=DEFAULT_OUTPUT,
        help=f"Nom du fichier JSON de sortie (defaut: {DEFAULT_OUTPUT})"
    )
    parser.add_argument(
        "--include-output",
        action="store_true",
        help="Inclut le fichier de sortie dans le manifest"
    )
    parser.add_argument(
        "--minify",
        action="store_true",
        help="Genere un JSON minifie"
    )

    args = parser.parse_args()

    root = os.path.abspath(args.folder)

    if not os.path.isdir(root):
        print(f"Erreur : dossier introuvable : {root}", file=sys.stderr)
        sys.exit(1)

    manifest = build_manifest(
        root=root,
        version=args.version,
        output_name=args.output,
        include_output=args.include_output
    )

    output_path = os.path.join(root, args.output)

    with open(output_path, "w", encoding="utf-8", newline="\n") as f:
        if args.minify:
            json.dump(manifest, f, ensure_ascii=False, separators=(",", ":"))
        else:
            json.dump(manifest, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Manifest genere : {output_path}")


if __name__ == "__main__":
    main()