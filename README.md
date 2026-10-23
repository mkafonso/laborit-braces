# laborit-braces

Fork de [`braces`](https://www.npmjs.com/package/braces) `3.0.3` com o patch de [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).

A `braces` até `3.0.3` não tem correção publicada. Um padrão abaixo do limite de 10.000 caracteres ainda pode aninhar o suficiente para estourar a pilha nos walkers recursivos de compile e expand. Esta versão mantém a API da `3.0.3` e adiciona os limites:

- o parser rejeita aninhamento de chaves ou parênteses acima de 128 níveis
- compile, expand e stringify rejeitam uma AST mais funda que 128 ou um ciclo em `nodes`
- expand rejeita um ciclo em `parent` em vez de entrar em loop

A versão do pacote é `3.0.4`, fora da faixa afetada `<= 3.0.3`.

Repositório: [mkafonso/laborit-braces](https://github.com/mkafonso/laborit-braces).

Código original: Jon Schlinkert, licença MIT (`LICENSE`).

## Usar no lugar da `braces` vulnerável

O nome publicado é `laborit-braces`. O override instala esse tarball em `node_modules/braces`, que é o caminho que o `micromatch` e o resto da árvore exigem.

npm e pnpm:

```json
{
  "overrides": {
    "braces": "npm:laborit-braces@3.0.4"
  }
}
```

No pnpm o bloco fica em `pnpm.overrides` com o mesmo valor.

Yarn 1:

```json
{
  "resolutions": {
    "braces": "npm:laborit-braces@3.0.4"
  }
}
```
