# Simplified Angular Schematics API
## @ngx-ext/schematics-api
If you are an Angular library author, looking for 
user-friendly Angular Schematics API wrapper,
then you are in the perfect place.

### Installation
```
npm install @ngx-ext/schematics-api @schematics/angular @angular-devkit/schematics
```

### Usage example:
`add-imports-to-root-module.rule.ts` file:
```typescript
import { Rule, Tree } from '@angular-devkit/schematics';
import { RootModule } from '@ngx-ext/schematics';

export function addImportsToRootModule(): Rule {
    return (tree: Tree) => {
        const rootModule = RootModule.getInstance(tree, '@my/lib');
        rootModule.addImport('MyLibModule.forRoot()');
        rootModule.addImport('MyLibModule2.forRoot()');
        rootModule.addExport('MyLibNestModule', '/nested');
        return rootModule.applyAllChanges();
    };
}
```

`schematics/ng-add/index.ts`:
```typescript
import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { addImportsToRootModule } from './add-imports-to-root-module.rule';
import { installDependencies } from './install-dependencies.rule';

export function ngAdd(_options: any): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    return chain([
      installDependencies(),
      addImportsToRootModule(),
    ]);
  };
}
```

After firing `ng add @my/lib` in Angular project, proper import statements and declarations will be added to its root module.
Example simplified output:
```typescript
import { MyLibModule, MyLibModule2 } from '@my/lib';
import { MyLibNestedModule } from '@my/lib/nested';

@NgModule({
  declarations: [/* no changes */],
  imports: [
    MyLibModule.forRoot(),
    MyLibModule2.forRoot(),
    MyLibNestedModule,
  ],
  exports: [MyLibNestedModule],
  providers: [/* no changes */],
  bootstrap: [AppComponent],
})
export class AppModule { }
```
