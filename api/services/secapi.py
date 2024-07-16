from typing import Annotated
import sys
from sec_api import ExtractorApi

class SecApiUtils:
    def __init__(self, api_key: str):
        self.sec_api_extractor = ExtractorApi(api_key=api_key)

    def get_10k_section(
        self,
        section: Annotated[
            str | int,
            "Section of the 10-K report to extract, should be in [1, 1A, 1B, 2, 3, 4, 5, 6, 7, 7A, 8, 9, 9A, 9B, 10, 11, 12, 13, 14, 15]",
        ],
        html_report_url: Annotated[
            str,
            "URL of the 10-K report .htm",
        ],
    ) -> str:
        """
        Get a specific section of a 10-K report from the SEC API.
        """
        if isinstance(section, int):
            section = str(section)
        if section not in [
            "1A",
            "1B",
            "7A",
            "9A",
            "9B",
        ] + [str(i) for i in range(1, 16)]:
            raise ValueError(
                "Section must be in [1, 1A, 1B, 2, 3, 4, 5, 6, 7, 7A, 8, 9, 9A, 9B, 10, 11, 12, 13, 14, 15]"
            )

        section_text = self.sec_api_extractor.get_section(html_report_url, section, "text")

        return section_text

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python secapi.py <API_KEY> <HTML_REPORT_URL> <SECTION>")
        sys.exit(1) 

    api_key = sys.argv[1]
    html_report_url = sys.argv[2] 
    section = sys.argv[3]

    sec_api_extractor = SecApiUtils(api_key)

    sec_section = sec_api_extractor.get_10k_section(html_report_url=html_report_url, section=section)
    print(sec_section)