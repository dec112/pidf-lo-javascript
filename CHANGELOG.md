# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.1] - 2023-11-28
### Fixed
- Transform circles with radius <1 meter as points.

## [1.2.0]
### Added
- New interface for `simpleArray`.

### Fixed
- Avoid multiprocessing of simple locations.
- Process all location info elements.

## [1.1.0]
### Added
- Support multiple simple locations.

## [1.0.2] - 2023-05-05
### Fixed
- Removed `dm` namespace for tuples as this is incorrect. The namespace should only be used for `Person` and `Device`.
