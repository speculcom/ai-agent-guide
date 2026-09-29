#!/usr/bin/env bash
# 用 gh CLI 走 contents API 推送本地文件到 GitHub
#
# 为什么不用 git push：
#   本环境有 HTTPS_PROXY=127.0.0.1:57167，git 的 schannel backend
#   在代理链上做证书吊销检查会报 CRYPT_E_NO_REVOCATION_CHECK（推不动）。
#   改成 openssl backend 或 node https 都绕不开（CONNECT 隧道静默挂死）。
#   gh CLI 内部自己处理证书，且能正常调 API —— 所以走 gh api。
#
# 为什么不用 git/blobs API：
#   空仓库调 POST /git/blobs 会返回 409 "Git Repository is empty"。
#   必须用 contents API（PUT /contents/<path>）建首个 commit。
#
# 用法：GH_TOKEN=<pat> bash scripts/push-remote.sh [文件...]
#       不给文件则推送 git ls-files 里的全部
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GH="C:/Users/chenhua/Desktop/1/gh_cli/bin/gh.exe"
OWNER="speculcom"
REPO="ai-coding-agent-atlas"
BRANCH="master"
# 注意：Windows 版 python 不认 /tmp，要用 Windows 路径
WD="C:/Users/chenhua/AppData/Local/Temp"

if [ -z "${GH_TOKEN:-}" ]; then
  echo "需要 GH_TOKEN 环境变量"; exit 1
fi

cd "$ROOT"

if [ $# -gt 0 ]; then
  FILES=("$@")
else
  mapfile -t FILES < <(git ls-files)
fi
echo "待同步 ${#FILES[@]} 个文件 → $OWNER/$REPO@$BRANCH"
echo ""

OK=0
FAILED=()
for f in "${FILES[@]}"; do
  if [ ! -f "$f" ]; then
    echo "  skip(本地不存在) $f"; continue
  fi
  B64=$(base64 -w0 "$f" | tr -d '\n')
  EXIST=$($GH api "repos/$OWNER/$REPO/contents/$f" --jq '.sha' 2>/dev/null || echo "")
  if [ -n "$EXIST" ]; then
    python -c "import json,sys;json.dump({'message':'sync: $f','content':sys.argv[1],'sha':sys.argv[2],'branch':sys.argv[3]},open(sys.argv[4],'w'))" \
      "$B64" "$EXIST" "$BRANCH" "$WD/c.json"
  else
    python -c "import json,sys;json.dump({'message':'add: $f','content':sys.argv[1],'branch':sys.argv[2]},open(sys.argv[3],'w'))" \
      "$B64" "$BRANCH" "$WD/c.json"
  fi
  if $GH api -X PUT "repos/$OWNER/$REPO/contents/$f" --input "$WD/c.json" --jq '.commit.sha' >/dev/null 2>&1; then
    OK=$((OK+1))
    [ $((OK % 10)) -eq 0 ] && echo "  ... $OK/${#FILES[@]}"
  else
    echo "  FAIL $f"
    FAILED+=("$f")
  fi
done

rm -f "$WD/c.json"
echo ""
echo "完成：成功 $OK，失败 ${#FAILED[@]}"
if [ ${#FAILED[@]} -gt 0 ]; then
  printf '  失败: %s\n' "${FAILED[@]}"
  exit 1
fi
echo "✅ https://github.com/$OWNER/$REPO/tree/$BRANCH"
