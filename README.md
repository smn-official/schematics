# Welcome to SMN Schematics! 🔥

Esse schematics foi criado para automatizar algumas tarefas e para ajudar a manter o padrão de desenvolvimento da nossa empresa, porém ele é de livre acesso para qualquer um. 

## Getting Started

Primeiro, você precisa instalar o schematics no seu projeto:    
```bash
 npm i --save-dev @smn-official/schematics
```

Pronto, agora podemos explorar os recursos disponíveis:

 - crud

### Crud
Cria uma tela com as quatros operações básicas(create, read, update, delete), para usa-lo você só precisa executar o seguinte comando:
```bash
 ng g @smn-official/schematics:crud nome-da-tela
```
Feito isso, será gerado os seguintes arquivos no seu projeto:

![crud structure](https://i.imgur.com/yqcTWlH.png)

***Note***: Se você tem sub projetos, basta passar o nome dele antes do nome-da-tela.

E você também pode passar alguns argumentos:

| Argumento | Função | Valor default |
|--|--|--| -- |
| -- help | Lista as opções disponíveis | |
| --convertion | Se a tela é uma tela de conversão | false |
| --route | A url que irá aparecer no browser | |

## Contribuindo
Se você deseja participar desse projeto criando novas features, resolvendo alguns bugs, criar alguns também 😝, segue o tutorial de como rodar o projeto no seu PC:

Antes de instalar qualquer coisa vamos clonar o repositório:
```bash
 git clone https://github.com/smn-official/schematics.git
```
Agora vamos instalar o [Schematics Cli](https://www.npmjs.com/package/@angular-devkit/schematics-cli)
```bash
 npm i -g @angular-devkit/schematics-cli
```
E as dependências do projeto:
```bash
 npm i
```

Pronto, agora precisamos observar qualquer mudança nos arquivos, para que seja feito o build automaticamente:
```bash
 npm run build:watch
```
Feito isso só precisamos saber como testar algum schematic.

### Testando localmente
Para saber como criar um schematic você pode olhar a documentação do [Angular](https://angular.io/guide/schematics) e para testar você vai precisar de um projeto Angular e na raiz dele execute o seguinte comando no terminal:
```bash
 schematics ../schematics/src/collection.json:nome-da-feature --debug=false
```
 - **schematics**: lib do schematics
 - **../schematics/src/collection.json:nome-da-feature**: Caminho relativo e nome da feature. Como estou dentro do projeto e o repositório do schematics é irmão dele, voltei uma pasta.
 - ***--debug=false***: Detecta a alteração na arvore de arquivos

Pronto. Agora você pode codar 😁.

## Publicação
Simplesmente rodar os seguintes comandos:
```bash
npm run build
npm publish
```
 É isso.

## Licença
MIT.

**Feito com  ❤️  pelos Devs da  [SMN](http://smn.com.br/)**