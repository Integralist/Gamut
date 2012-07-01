/*
Adobe Systems Incorporated(r) Source Code License Agreement
Copyright(c) 2005 Adobe Systems Incorporated. All rights reserved.
	
Please read this Source Code License Agreement carefully before using
the source code.
	
Adobe Systems Incorporated grants to you a perpetual, worldwide, non-exclusive,
no-charge, royalty-free, irrevocable copyright license, to reproduce,
prepare derivative works of, publicly display, publicly perform, and
distribute this source code and such derivative works in source or
object code form without any attribution requirements.
	
The name "Adobe Systems Incorporated" must not be used to endorse or promote products
derived from the source code without prior written permission.
	
You agree to indemnify, hold harmless and defend Adobe Systems Incorporated from and
against any loss, damage, claims or lawsuits, including attorney's
fees that arise or result from your use or distribution of the source
code.
	
THIS SOURCE CODE IS PROVIDED "AS IS" AND "WITH ALL FAULTS", WITHOUT
ANY TECHNICAL SUPPORT OR ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING,
BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
FOR A PARTICULAR PURPOSE ARE DISCLAIMED. ALSO, THERE IS NO WARRANTY OF
NON-INFRINGEMENT, TITLE OR QUIET ENJOYMENT. IN NO EVENT SHALL MACROMEDIA
OR ITS SUPPLIERS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOURCE CODE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

package com.adobe.crypto
{

	import com.adobe.crypto.WSSEUsernameToken;
	
	import flexunit.framework.TestCase;
	import flexunit.framework.TestSuite;
	
	public class WSSEUsernameTokenTest extends TestCase {
		
	    public function WSSEUsernameTokenTest( methodName:String = null ) {
			super( methodName );
        }
		
		public function testWSSEUsernameToken():void {
		
			// Results generated from stripped-down version of Claude
			// Montpetit's WSSE-enabled Atom API client (see
			// http://www.montpetit.net/en/2004/06/06/11h32/index.html).
			//
			
			var date:Date = new Date(Date.parse("05/09/2006 13:43:21 GMT-0700"));
			assertWSSEUsernameToken( "abc", "abc", "0123456789", date,
				 "UsernameToken Username=\"abc\", PasswordDigest=\"" 
				 + WSSEUsernameToken.getBase64Digest( WSSEUsernameToken.base64Encode( "0123456789" ),
				 									WSSEUsernameToken.generateTimestamp( date ),
				 									"abc" ) 
				 + "\", Nonce=\"MDEyMzQ1Njc4OQ==\", Created=\"2006-05-09T" + ( date.hours < 10 ? "0" + date.hours : date.hours ) + ":43:21Z\"" );
			
			date = new Date(Date.parse("05/09/2006 16:11:46 GMT-0700"));
			assertWSSEUsernameToken( "fe31_449", "168fqo4659", "1147216300992", date,
				 "UsernameToken Username=\"fe31_449\", PasswordDigest=\"" 
				 + WSSEUsernameToken.getBase64Digest( WSSEUsernameToken.base64Encode( "1147216300992" ), 
				 									WSSEUsernameToken.generateTimestamp( date ), 
				 									"168fqo4659" ) 
				 + "\", Nonce=\"MTE0NzIxNjMwMDk5Mg==\", Created=\"2006-05-09T" + ( date.hours < 10 ? "0" + date.hours : date.hours ) + ":11:46Z\"" );
				 
			date = new Date(Date.parse("08/16/2006 01:48:28 GMT-0700"));
			assertWSSEUsernameToken( "candy", "dandy", "2018558572", date,
				 "UsernameToken Username=\"candy\", PasswordDigest=\"" 
				 + WSSEUsernameToken.getBase64Digest( WSSEUsernameToken.base64Encode( "2018558572" ), 
				 									WSSEUsernameToken.generateTimestamp( date ), 
				 									"dandy" )
				 + "\", Nonce=\"MjAxODU1ODU3Mg==\", Created=\"2006-08-16T" + ( date.hours < 10 ? "0" + date.hours : date.hours ) + ":48:28Z\"" );
		}
		
		private function assertWSSEUsernameToken( username:String, password:String, nonce:String,
				timestamp:Date, expected:String ):void {
			var result:String = WSSEUsernameToken.getUsernameToken( username, password, nonce, timestamp );
			
			assertTrue( "WSSEUsernameToken returned wrong value ('" + result + "')" + expected,
						result == expected );
		}		
	}
}