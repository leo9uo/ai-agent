import os 
from typing import Annotated
from dotenv import load_dotenv
import sys
from sec_api import ExtractorApi

load_dotenv(".env")

class SecApiUtils:
    def __init__(self):
        self.sec_api_extractor = self.init_sec_api_client()

    def init_sec_api_client(self):
        if os.environ.get("NEXT_PUBLIC_SEC_API_KEY") is None:
            raise Exception("Missing SEC_API_KEY in .env")
        else:
            sec_api_extractor = ExtractorApi(api_key=os.environ.get("NEXT_PUBLIC_SEC_API_KEY"))
            return sec_api_extractor

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
    if len(sys.argv) < 3:
        print("Usage: python secapi.py <HTML_REPORT_URL> <SECTION>")
        sys.exit(1) 

    html_report_url = sys.argv[1] 
    section = sys.argv[2]

    sec_api_extractor = SecApiUtils()

    sec_section = sec_api_extractor.get_10k_section(html_report_url=html_report_url, section=section)
    print(sec_section)