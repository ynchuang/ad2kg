# Ad2kg

This is a repository for the review SIGIR'23 demo paper.

To visit our demo website, please refer to the website link [DiscoverPath.top](http://www.discoverpath.top/).

## Repository structure

    .
    ├── modeling         # KG and Rec engines/models
    ├── web              # Web sources
    └── README.md

## Planning feature.

- [ v ] API construction
    - [ v ] Basic functionality
    - [ v ] Recommendation/IR Moudule
- [ v ] Web construction

## Environment
-  OpenJDK 1.8
-  Python 3.7
-  neo4j 3.5

### start neo4j server
```sh
<NEO4J_HOME>/bin/neo4j console
<NEO4J_HOME>/bin/neo4j start
./bin/neo4j-admin  set-initial-password neo4j1
```

### Initiaize Neo4j Data
```sh
python clean.py
python neo2example.py
```
