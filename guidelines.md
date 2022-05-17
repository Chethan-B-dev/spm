FE - Frontend
BE - Backend

1) when starting to work on the project always pull the latest copy from the repo

```bash
git pull
```

2) Whenever creating or working on a new Feature, create a new branch with the format given below

```bash
git checkout -b branch_name
```
example: FE/feature-name

3) after coding your feature, commit the changes according to the following format

```bash
git commit -m "
FE: feature-name 
"```

or

```bash
git commit -m "
BE: feature-name 
"```

4) after commiting changes push it to the repo then go and raise a pull request to merge your branch to the main branch

```bash
git push -f
```

5) after which i will see the pull request and merge it.

**WARNING: dont push code to main branch beacuse we will all be working at the same time and we should deal with merge conflicts
that is why always create a new branch**
