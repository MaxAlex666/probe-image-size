2.2.0 / 2016-10-26
------------------

- Add `.url` with actual image address (after redirects) for remotes.


2.1.1 / 2016-08-25
------------------

- Add default user agent to http requests (if not set by options), #8.


2.1.0 / 2016-07-14
------------------

- Internal parsers api cleanup - switch from callbacks to events.
- Fixed "write after end" error under heavy load.


2.0.1 / 2016-07-01
------------------

- Fixed bug in streams cleanup condition.


2.0.0 / 2016-06-25
------------------

- SVG support
- width/height now can be float (with fractional part)
- Return dimention units ('px' everywhere except SVG)


1.2.1 / 2016-05-30
------------------

- Stream: posponed callback to avoid possible races on forced stream close.


1.2.0 / 2016-05-28
------------------

- Added `.sync.probe()` method.
- Splited to separate files (simplify browserification).
- Faster return on positive result & faster resource release.
- Fix stream error handling.
- 100% tests coverage.


1.1.0 / 2016-05-25
------------------

- Added promise support.
- Use `readable-stream` instead of `stream`.
- Reorganised internal files structure & tests.


1.0.6 / 2016-04-13
------------------

- Fixed parser crashes on zero length data & offsets.


1.0.5 / 2015-12-15
------------------

- Increased http request timeout to 30 seconds.
- Don't check SSL sertificates.


1.0.4 / 2015-09-22
------------------

- Fixed crash on empty JPEG markers.


1.0.3 / 2015-09-19
------------------

- Fixed catch internal exceptions from `request`.


1.0.2 / 2015-09-16
------------------

- Added `ECONTENT` error code for parse errors.


1.0.1 / 2015-09-14
------------------

- Return image length when possible.
- Support URLs in dev helper script.


1.0.0 / 2015-09-12
------------------

- First release.
